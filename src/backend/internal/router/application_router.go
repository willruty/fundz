package router

import (
	"github.com/gin-gonic/gin"
)

func SetupApplicationRouter(rg *gin.RouterGroup) {

	dashboard := rg.Group("/dashboard")
	{
		dashboard.GET("/")
	}

}
