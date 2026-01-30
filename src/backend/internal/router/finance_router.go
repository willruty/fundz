package router

import (
	controller "fundz/internal/controller"

	"github.com/gin-gonic/gin"
)

func SetupFinanceRouter(rg *gin.RouterGroup) {

	finance := rg.Group("/finance")
	{

		// === Transaction ===
		transaction := finance.Group("/transaction")
		{
			// === Transactions CRUD ===
			transaction.GET("/", controller.GetAllTransactions)
			transaction.GET("/:id", controller.GetTransactionById)
			transaction.POST("/", controller.CreateTransaction)
			transaction.PUT("/", controller.UpdateTransactionById)
			transaction.DELETE("/:id", controller.DeleteTransactionById)
		}

		// === Categories ===
		category := finance.Group("/category")
		{
			// === Categories CRUD ===
			category.GET("/", controller.GetAllCategories)
			category.GET("/:id", controller.GetCategoryById)
			category.POST("/", controller.CreateCategory)
			category.PUT("/", controller.UpdateCategoryById)
			category.DELETE("/:id", controller.DeleteCategoryById)
		}

		// === Goal ===
		goal := finance.Group("/goal")
		{
			// === Goals CRUD ===
			goal.GET("/", controller.GetAllGoals)
			goal.GET("/:id", controller.GetGoalById)
			goal.POST("/", controller.CreateGoal)
			goal.PUT("/", controller.UpdateGoalById)
			goal.DELETE("/:id", controller.DeleteGoalById)
		}
	}
}
