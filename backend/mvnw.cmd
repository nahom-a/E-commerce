@echo off
@REM Maven Wrapper for Windows
setlocal
cd /d "%~dp0\.."
java -cp ".mvn/wrapper/maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*