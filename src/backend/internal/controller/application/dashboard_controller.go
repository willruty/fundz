package application

import (
	"fundz/internal/service/application"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardOverview(c *gin.Context) {

	userID := c.MustGet("userID").(string)

	var dashService application.DashboardService
	summary, err := dashService.GetDashboardOverview(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": summary,
	})
}
