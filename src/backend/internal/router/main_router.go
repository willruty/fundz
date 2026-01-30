package router

import (
	"fundz/internal/controller"
	"fundz/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func configRouter() cors.Config {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"POST", "GET", "DELETE", "PUT"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.ExposeHeaders = []string{"Origin", "Content-Type"}
	config.AllowCredentials = true
	return config
}

func SetupMainRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)

	route := gin.New()
	route.Use(gin.Recovery())
	route.Use(gin.Logger())
	route.Use(cors.New(configRouter()))

	main := route.Group("/fundz")
	main.GET("/heath", controller.GetHealth)

	SetupUserRouter(main)
	
	// === Transaction ===
	transaction := main.Group("/transaction")
	{
		// === Transactions CRUD ===
		transaction.GET("/", controller.GetAllTransactions)
		transaction.GET("/:id", controller.GetTransactionById)
		transaction.POST("/", controller.CreateTransaction)
		transaction.PUT("/", controller.UpdateTransactionById)
		transaction.DELETE("/:id", controller.DeleteTransactionById)
	}

	// === Categories ===
	category := main.Group("/category")
	{
		// === Categories CRUD ===
		category.GET("/", controller.GetAllCategories)
		category.GET("/:id", controller.GetCategoryById)
		category.POST("/", controller.CreateCategory)
		category.PUT("/", controller.UpdateCategoryById)
		category.DELETE("/:id", controller.DeleteCategoryById)
	}

	// === Goal ===
	goal := main.Group("/goal")
	{
		// === Goals CRUD ===
		goal.GET("/", controller.GetAllGoals)
		goal.GET("/:id", controller.GetGoalById)
		goal.POST("/", controller.CreateGoal)
		goal.PUT("/", controller.UpdateGoalById)
		goal.DELETE("/:id", controller.DeleteGoalById)
	}

	service.PrintBanner()

	return route
}
