package controller

import (
	"fundz/internal/model/dao"
	entity "fundz/internal/model/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var category entity.Categories

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.CreateCategory(category, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": category})
}

func GetAllCategories(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	categories, rowsAffected, err := dao.GetAllCategories(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar categorias"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results":      categories,
		"RowsAffected": rowsAffected,
		"RecordCount":  len(categories),
	})
}

func GetCategoryById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	result, err := dao.GetCategoryByID(c.Param("id"), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func UpdateCategoryById(c *gin.Context) {
	var input entity.Categories
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.MustGet("userID").(string)

	if err := dao.UpdateCategoryByID(input, input.ID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteCategoryById(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	if err := dao.DeleteCategoryByID(c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "categoria removida"})
}
