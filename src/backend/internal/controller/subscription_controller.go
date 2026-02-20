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
func CreateSubscription(c *gin.Context) {

	var subscription entity.Subscriptions

	if err := c.ShouldBindJSON(&subscription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.CreateSubscription(subscription); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": subscription,
	})
}

// -------
// GetAll
// -------
func GetAllSubscriptions(c *gin.Context) {

	subscriptions, rowsAffected, err := dao.FindAllSubscriptions()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Nenhum registro encontrado: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK,
		gin.H{
			"results":      subscriptions,
			"RowsAffected": rowsAffected,
			"RecordCount":  len(subscriptions),
		})
}

// -------
// GetById
// -------
func GetSubscriptionById(c *gin.Context) {

	result, err := dao.FindSubscriptionById(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// -------
// UpdateById
// -------
func UpdateSubscriptionById(c *gin.Context) {

	var input entity.Subscriptions
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if _, err := dao.FindSubscriptionById(input.ID.String()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.UpdateSubscriptionById(input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to update record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// -------
// DeleteById
// -------
func DeleteSubscriptionById(c *gin.Context) {

	id := c.Param("id")

	if _, err := dao.FindSubscriptionById(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.DeleteSubscriptionById(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to delete record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "row deleted"})
}
