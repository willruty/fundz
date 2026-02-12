package controller

import (
	model "fundz/internal/model/entity"
	"fundz/internal/service"
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

	err, token := service.RegisterUser(user)
	if err != "" {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err})
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
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	err, token := service.LoginUser(req.Email, req.Password)
	if err != "" {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err})
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
