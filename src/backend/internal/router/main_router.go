package router

import (
	"fundz/internal/controller"
	"fundz/internal/middleware"
	"fundz/internal/util"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func configRouter() cors.Config {
	return cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "http://localhost:5173" || origin == "http://localhost:3000" {
				return true
			}
			if strings.HasSuffix(origin, ".vercel.app") {
				return true
			}
			if custom := os.Getenv("ALLOWED_ORIGIN"); custom != "" && origin == custom {
				return true
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
}

func SetupMainRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)

	route := gin.New()
	route.Use(gin.Recovery())
	route.Use(gin.Logger())
	route.Use(cors.New(configRouter()))

	// Garante que requests OPTIONS de preflight sempre recebam resposta CORS correta
	route.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	main := route.Group("/fundz")
	main.GET("/heath", controller.GetHealth)

	SetupUserRouter(main)
	SetupApplicationRouter(main)

	// // === Account ===
	account := main.Group("/account")
	account.Use(middleware.AuthMiddleware)
	{
		// === Account CRUD ===
		account.GET("/", controller.GetAllAccounts)
		account.GET("/:id", controller.GetAccountById)
		account.GET("/balance/:id", controller.GetCurrentBalance)
		account.POST("/", controller.CreateAccount)
		account.PUT("/", controller.UpdateAccountById)
		account.DELETE("/:id", controller.DeleteAccountById)
	}

	// === Transaction ===
	transaction := main.Group("/transaction")
	transaction.Use(middleware.AuthMiddleware)
	{
		// === Transactions CRUD ===
		transaction.GET("/", controller.GetAllTransactions)
		transaction.GET("/last-month", controller.GetLastMonthTransactions)
		transaction.GET("/:id", controller.GetTransactionById)
		transaction.POST("/", controller.CreateTransaction)
		transaction.PUT("/", controller.UpdateTransactionById)
		transaction.DELETE("/:id", controller.DeleteTransactionById)
	}

	// === Categories ===
	category := main.Group("/category")
	category.Use(middleware.AuthMiddleware)
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
	goal.Use(middleware.AuthMiddleware)
	{
		// === Goals CRUD ===
		goal.GET("/", controller.GetAllGoals)
		goal.GET("/:id", controller.GetGoalById)
		goal.POST("/", controller.CreateGoal)
		goal.PUT("/", controller.UpdateGoalById)
		goal.DELETE("/:id", controller.DeleteGoalById)
	}

	// === Subscription ===
	subscription := main.Group("/subscription")
	subscription.Use(middleware.AuthMiddleware)
	{
		// === Subscription CRUD ===
		subscription.GET("/", controller.GetAllSubscriptions)
		subscription.GET("/:id", controller.GetSubscriptionById)
		subscription.POST("/", controller.CreateSubscription)
		subscription.PUT("/", controller.UpdateSubscriptionById)
		subscription.DELETE("/:id", controller.DeleteSubscriptionById)
	}

	util.PrintBanner()

	return route
}
