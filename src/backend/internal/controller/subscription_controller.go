package controller

import (
	"fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateSubscription(c *gin.Context) {
	var subscription entity.Subscriptions

	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.CreateSubscription(subscription, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": subscription})
}

func GetAllSubscriptions(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	subscriptions, rowsAffected, err := dao.FindAllSubscriptions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar assinaturas"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results":      subscriptions,
		"RowsAffected": rowsAffected,
		"RecordCount":  len(subscriptions),
	})
}

func GetSubscriptionById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	result, err := dao.FindSubscriptionByID(c.Param("id"), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func UpdateSubscriptionById(c *gin.Context) {
	var input entity.Subscriptions
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.UpdateSubscriptionByID(input, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteSubscriptionById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	if err := dao.DeleteSubscriptionByID(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "assinatura removida"})
}
