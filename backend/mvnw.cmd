@ECHO OFF
SET "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.6.7-hotspot"
IF EXIST "C:\tools\apache-maven-3.9.9\bin\mvn.cmd" (
    CALL "C:\tools\apache-maven-3.9.9\bin\mvn.cmd" %*
) ELSE (
    mvn %*
)
