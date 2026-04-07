package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type service struct {
	Port int
}

type database struct {
	Port         int
	Host         string
	DatabaseName string
	User         string
	Password     string
	SSlMode      string
}

type Jwt struct {
	JWTSECRET string
}

type ConfigEnv struct {
	Service  service
	Database database
	Jwt      Jwt
}

var Env ConfigEnv

func Load() error {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	Env = ConfigEnv{}

	Env.Service.Port, _ = strconv.Atoi(os.Getenv("SERVICE_PORT"))

	Env.Database.Host = os.Getenv("DATABASE_HOST")
	Env.Database.Port, _ = strconv.Atoi(os.Getenv("DATABASE_PORT"))
	Env.Database.User = os.Getenv("DATABASE_USER")
	Env.Database.Password = os.Getenv("DATABASE_PASSWORD")
	Env.Database.DatabaseName = os.Getenv("DATABASE_DBNAME")
	Env.Database.SSlMode = os.Getenv("DATABASE_SSLMODE")

	Env.Jwt.JWTSECRET = os.Getenv("JWT_SECRET")

	return nil
}
