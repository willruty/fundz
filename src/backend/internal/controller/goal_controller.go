package controller

import (
	dao "fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"fundz/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// -------
// Create
// -------
func CreateGoal(c *gin.Context) {

	var goal entity.Goals

	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.CreateGoal(goal); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": goal,
	})
}

// -------
// GetAll
// -------
func GetAllGoals(c *gin.Context) {

	userID := c.MustGet("userID").(string)

	goals, rowsAffected, err := dao.FindAllGoals(userID)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Nenhum registro encontrado: " + err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK,
		gin.H{
			"results":      goals,
			"RowsAffected": rowsAffected,
			"RecordCount":  len(goals),
		})
}

// -------
// GetById
// -------
func GetGoalById(c *gin.Context) {

	result, err := dao.FindGoalById(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// -------
// GetNextGoalByToken
// -------
func GetNextGoal(c *gin.Context) {

	userID := c.MustGet("userID").(string)

	goal, percentage, err := service.FilterNextGoal(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"data": gin.H{
		"name":           goal.Name,
		"target_amount":   goal.TargetAmount,
		"current_amount": goal.CurrentAmount,
		"due_date":       goal.DueDate,
		"percentage":     percentage,
	}})
}

// -------
// UpdateById
// -------
func UpdateGoalById(c *gin.Context) {

	var input entity.Goals
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if _, err := dao.FindGoalById(input.ID.String()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.UpdateGoalById(input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to update record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// -------
// DeleteById
// -------
func DeleteGoalById(c *gin.Context) {

	id := c.Param("id")

	if _, err := dao.FindGoalById(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	if err := dao.DeleteGoalById(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Failed to delete record " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "row deleted"})
}
