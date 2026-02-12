package service

import (
	"fundz/internal/model/dao"
	model "fundz/internal/model/entity"
	"fundz/internal/util"
	"strings"
)

func RegisterUser(user model.Users) (string, string) {
	user.Email = strings.TrimSpace(strings.ToLower(user.Email))
	passwordPura := strings.TrimSpace(user.PasswordHash)

	_, err := dao.GetUserByEmail(user.Email)
	if err == nil {
		return "Conta já cadastrada", ""
	}

	hashedPassword, err := util.HashPassword(passwordPura)
	if err != nil {
		return "Erro ao processar segurança da senha", ""
	}

	user.PasswordHash = hashedPassword

	if err := dao.CreateUser(&user); err != nil {
		return "Erro ao salvar usuário: " + err.Error(), ""
	}

	token, err := GenerateJWT(user.ID)
	if err != nil {
		return "Usuário criado, mas erro ao gerar acesso: " + err.Error(), ""
	}

	return "", token
}

func LoginUser(email, password string) (string, string) {

	user, err := dao.GetUserByEmail(email)
	if err != nil {
		return "Email ou senha inválidos" + err.Error(), ""
	}

	if !util.CheckPasswordHash(strings.TrimSpace(password), user.PasswordHash) {
		return "Email ou senha inválidos - erro na validação do hash", ""
	}

	token, err := GenerateJWT(user.ID)
	if err != nil {
		return "Erro ao gerar token" + err.Error(), ""
	}

	return "", token
}
