package controller

import (
	dao "fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// -------
// Create
// -------
func CreateAccount(c *gin.Context) {
	var account entity.Accounts

	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.CreateAccount(account); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": account,
	})
}

// -------
// GetAll
// -------
func GetAllAccounts(c *gin.Context) {

	userID := c.MustGet("userID").(string)
	
	accounts, rowsAffected, err := dao.GetAllAccounts(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Nenhum registro encontrado: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK,
		gin.H{
			"results":      accounts,
			"RowsAffected": rowsAffected,
			"RecordCount":  len(accounts),
		})
}

// -------
// GetById
// -------
func GetAccountById(c *gin.Context) {
	result, err := dao.GetAccountById(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// -------
// GetBurrentBalanceById
// -------
func GetCurrentBalance(c *gin.Context) {

	userID := c.MustGet("userID").(string)

	balance, err := dao.GetCurrentBalanceById(userID, c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"current_balance": balance})
}

// -------
// UpdateById
// -------
func UpdateAccountById(c *gin.Context) {
	var input entity.Accounts
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	// Seguindo seu padrão de passar a entidade e o ID separadamente
	if err := dao.UpdateAccountById(input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to update record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// -------
// DeleteById
// -------
func DeleteAccountById(c *gin.Context) {
	if err := dao.DeleteAccountById(c.Param("id")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to delete record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "row deleted"})
}
