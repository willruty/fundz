package controller

import (
	"fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAccount(c *gin.Context) {
	var account entity.Accounts

	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.CreateAccount(account, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": account})
}

func GetAllAccounts(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	accounts, rowsAffected, err := dao.GetAllAccounts(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar contas"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results":      accounts,
		"RowsAffected": rowsAffected,
		"RecordCount":  len(accounts),
	})
}

func GetAccountById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	result, err := dao.GetAccountByID(c.Param("id"), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func GetCurrentBalance(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	balance, err := dao.GetCurrentBalanceByID(userID, c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Conta não encontrada"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"current_balance": balance})
}

func UpdateAccountById(c *gin.Context) {
	var input entity.Accounts
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.UpdateAccountByID(input, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteAccountById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	if err := dao.DeleteAccountByID(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "conta removida"})
}
