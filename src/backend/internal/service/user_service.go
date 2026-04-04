package service

import (
	"errors"
	"fmt"
	"fundz/internal/model/dao"
	model "fundz/internal/model/entity"
	"fundz/internal/util"
	"strings"
)

var (
	ErrEmailJaCadastrado = errors.New("email já cadastrado")
	ErrCredenciaisInvalidas = errors.New("email ou senha inválidos")
)

func RegisterUser(user model.Users) (name string, token string, err error) {
	user.Email = strings.TrimSpace(strings.ToLower(user.Email))
	passwordPura := strings.TrimSpace(user.PasswordHash)

	if _, dbErr := dao.GetUserByEmail(user.Email); dbErr == nil {
		return "", "", ErrEmailJaCadastrado
	}

	hashedPassword, hashErr := util.HashPassword(passwordPura)
	if hashErr != nil {
		return "", "", errors.New("erro ao processar senha")
	}

	user.PasswordHash = hashedPassword

	if dbErr := dao.CreateUser(&user); dbErr != nil {
		return "", "", fmt.Errorf("erro ao salvar usuário: %w", dbErr)
	}

	token, err = GenerateJWT(user.ID)
	if err != nil {
		return "", "", fmt.Errorf("usuário criado, mas erro ao gerar token: %w", err)
	}

	return user.Name, token, nil
}

func LoginUser(email, password string) (name string, token string, err error) {
	user, dbErr := dao.GetUserByEmail(strings.TrimSpace(strings.ToLower(email)))
	if dbErr != nil {
		return "", "", ErrCredenciaisInvalidas
	}

	if !util.CheckPasswordHash(strings.TrimSpace(password), user.PasswordHash) {
		return "", "", ErrCredenciaisInvalidas
	}

	token, err = GenerateJWT(user.ID)
	if err != nil {
		return "", "", fmt.Errorf("erro ao gerar token: %w", err)
	}

	return user.Name, token, nil
}
