package router

import (
	"fundz/internal/controller/application"
	"fundz/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupApplicationRouter(rg *gin.RouterGroup) {

	dashboard := rg.Group("/dashboard")
	dashboard.Use(middleware.AuthMiddleware)
	{
		dashboard.GET("/overview", application.DashboardOverview)
	}

}
