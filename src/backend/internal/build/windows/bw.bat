@echo on
setlocal

set GOOS=windows
set GOARCH=amd64
set VERSION=%date:~-4,4%.%date:~3,2%.%date:~0,2%.%time:~0,2%%time:~3,2%
set VERSION=%VERSION: =0%

go build -o ../../../../../bin/windows/fundz.exe -ldflags "-X=main.version=%VERSION% -X=main.debug=true" ../../../cmd/fundz/main.go

if %errorlevel% == 0 ( 
    copy /Y ..\..\..\..\..\configs\.env ..\..\..\..\..\bin\windows\.env
    echo " BUILD REALIZADO COM SUCESSO "
) else ( 
    echo " ERRO NO PROCESSO DE BUILD "
)

endlocal