package com.raylive.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Slf4j
@Configuration
@Profile("prod")
public class PostgresDataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUser;

    @Value("${spring.datasource.password:}")
    private String configuredPass;

    @Bean
    @Primary
    public DataSource dataSource() {
        String envDbUrl = System.getenv("DATABASE_URL");
        if (!StringUtils.hasText(envDbUrl)) {
            envDbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (!StringUtils.hasText(envDbUrl)) {
            envDbUrl = configuredUrl;
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (StringUtils.hasText(envDbUrl) && (envDbUrl.startsWith("postgres://") || envDbUrl.startsWith("postgresql://"))) {
            try {
                // Parse standard URI format: postgres://user:password@host:port/dbname
                URI uri = new URI(envDbUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "raylive_db";

                String query = uri.getQuery();

                // Check if host resolves via standard OS DNS; if local ISP router refuses it, resolve via Google DNS 8.8.8.8
                String targetHost = host;
                try {
                    java.net.InetAddress.getByName(host);
                } catch (java.net.UnknownHostException e) {
                    log.warn("Local OS DNS refused resolution for {}, resolving via Google Public DNS 8.8.8.8...", host);
                    try {
                        java.util.Hashtable<String, String> jndiEnv = new java.util.Hashtable<>();
                        jndiEnv.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
                        jndiEnv.put(javax.naming.Context.PROVIDER_URL, "dns://8.8.8.8");
                        javax.naming.directory.DirContext ictx = new javax.naming.directory.InitialDirContext(jndiEnv);
                        javax.naming.directory.Attributes attrs = ictx.getAttributes(host, new String[]{"A"});
                        javax.naming.directory.Attribute a = attrs.get("A");
                        if (a != null) {
                            targetHost = (String) a.get();
                            log.info("Successfully resolved {} -> {} via Google DNS fallback", host, targetHost);
                            String endpointName = host.split("\\.")[0];
                            config.addDataSourceProperty("options", "endpoint=" + endpointName);
                        }
                    } catch (Exception ex) {
                        log.error("Failed Google DNS fallback lookup: {}", ex.getMessage());
                    }
                }

                String jdbcUrl = "jdbc:postgresql://" + targetHost + ":" + port + "/" + dbName;
                if (StringUtils.hasText(query)) {
                    // Clean query for pgjdbc compatibility (strip channel_binding if present as pooler terminates TLS)
                    String cleanedQuery = query.replaceAll("channel_binding=[^&]*&?", "").replaceAll("&$", "");
                    if (StringUtils.hasText(cleanedQuery)) {
                        jdbcUrl += "?" + cleanedQuery;
                    } else {
                        jdbcUrl += "?sslmode=require";
                    }
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                config.setJdbcUrl(jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    config.setUsername(userInfo[0]);
                    if (userInfo.length > 1) {
                        config.setPassword(userInfo[1]);
                    }
                } else {
                    if (StringUtils.hasText(configuredUser)) config.setUsername(configuredUser);
                    if (StringUtils.hasText(configuredPass)) config.setPassword(configuredPass);
                }
                log.info("Initialized PostgreSQL DataSource from cloud URI: jdbc:postgresql://{}:{}/{}", host, port, dbName);
            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL as URI, falling back to direct URL: {}", e.getMessage());
                String jdbcUrl = envDbUrl.startsWith("jdbc:") ? envDbUrl : "jdbc:" + envDbUrl;
                config.setJdbcUrl(jdbcUrl);
                if (StringUtils.hasText(configuredUser)) config.setUsername(configuredUser);
                if (StringUtils.hasText(configuredPass)) config.setPassword(configuredPass);
            }
        } else {
            // Already standard JDBC or parameter-based URL
            String jdbcUrl = StringUtils.hasText(envDbUrl) ? envDbUrl : configuredUrl;
            if (StringUtils.hasText(jdbcUrl) && !jdbcUrl.startsWith("jdbc:postgresql:")) {
                jdbcUrl = "jdbc:postgresql://" + jdbcUrl.replaceFirst("^jdbc:", "");
            }
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(StringUtils.hasText(System.getenv("DB_USER")) ? System.getenv("DB_USER") : configuredUser);
            config.setPassword(StringUtils.hasText(System.getenv("DB_PASSWORD")) ? System.getenv("DB_PASSWORD") : configuredPass);
            log.info("Initialized PostgreSQL DataSource from standard JDBC configuration");
        }

        // HikariCP connection pool settings optimized for Cloud PostgreSQL
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
