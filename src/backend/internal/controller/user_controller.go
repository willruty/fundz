package controller

import (
	dao "fundz/internal/model/dao"
	model "fundz/internal/model/entity"
	"fundz/internal/service"
	"fundz/internal/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

// -------
// Create
// -------
func Register(c *gin.Context) {

	var user model.Users

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	hashedPassword, err := util.HashPassword(user.PasswordHash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao hashear a senha"})
		return
	}
	user.PasswordHash = hashedPassword

	if err := dao.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	token, err := service.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

// -------
// Login
// -------
func Login(c *gin.Context) {

	var req struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	user, err := dao.GetUserByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	if !util.CheckPasswordHash(req.Password, user.PasswordHash) {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	token, err := service.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func ValidateToken(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Token válido",
		"user_id": userID,
	})
}

// -------
// UpdateById
// -------
func UpdateUserById(c *gin.Context) {

	var input model.Users
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.UpdateUserById(input, input.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to update record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// -------
// DeleteById
// -------
func DeleteUserById(c *gin.Context) {

	if err := dao.DeleteUserById(c.Param("id")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to delete record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "row deleted"})
}
