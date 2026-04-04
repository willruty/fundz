package controller

import (
	"fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"fundz/internal/service"
	"net/http"

	"github.com/google/uuid"
	"github.com/gin-gonic/gin"
)

func CreateTransaction(c *gin.Context) {
	var transaction entity.Transactions

	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.CreateTransaction(transaction, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": transaction})
}

func GetAllTransactions(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	transactions, rowsAffected, err := dao.GetAllTransactions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar transações"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results":      transactions,
		"RowsAffected": rowsAffected,
		"RecordCount":  len(transactions),
	})
}

func GetLastMonthTransactions(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	var transactionService service.TransactionService
	transactions, err := transactionService.GetLastMonthTransactions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar transações"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func GetTransactionById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	result, err := dao.GetTransactionByID(c.Param("id"), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func UpdateTransactionById(c *gin.Context) {
	var input entity.Transactions
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if input.ID == (uuid.UUID{}) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da transação é obrigatório"})
		return
	}

	if err := dao.UpdateTransactionByID(input, input.ID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteTransactionById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	if err := dao.DeleteTransactionByID(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "transação removida"})
}
