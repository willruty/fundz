package router

import (
	"fundz/internal/controller"
	"fundz/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupUserRouter(rg *gin.RouterGroup) {

	user := rg.Group("/user")
	{
		// === User CRUD ===
		user.POST("/auth/register", controller.Register)
		user.POST("/auth/login", controller.Login)

		validatedUser := user.Group("/")
		validatedUser.Use(middleware.AuthMiddleware)
		{
			validatedUser.GET("auth/validate", controller.ValidateToken)
			validatedUser.PUT("/", controller.UpdateUserById)
			validatedUser.DELETE("/:id", controller.DeleteUserById)
		}
	}
}
