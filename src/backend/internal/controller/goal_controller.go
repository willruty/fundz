package controller

import (
	"fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateGoal(c *gin.Context) {
	var goal entity.Goals

	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.CreateGoal(goal, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": goal})
}

func GetAllGoals(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	goals, rowsAffected, err := dao.FindAllGoals(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar metas"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results":      goals,
		"RowsAffected": rowsAffected,
		"RecordCount":  len(goals),
	})
}

func GetGoalById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	result, err := dao.FindGoalByID(c.Param("id"), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func UpdateGoalById(c *gin.Context) {
	var input entity.Goals
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.UpdateGoalByID(input, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteGoalById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	if err := dao.DeleteGoalByID(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "meta removida"})
}
