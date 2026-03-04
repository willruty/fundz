package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type DashboardDTO struct {
	Accounts              []AccountSummaryDTO
	Goals                 []GoalSummaryDTO
	LastMonthTransactions []TransactionSummaryDTO
	Categories            CategorySummaryDTO
}

type AccountSummaryDTO struct {
	Name  string
	Value decimal.Decimal
}

type GoalSummaryDTO struct {
	Name       string
	Target     decimal.Decimal
	Current    decimal.Decimal
	Date       time.Time
	Percentage decimal.Decimal
}

type TransactionSummaryDTO struct {
	Date  time.Time
	Value decimal.Decimal
	Type  string
}

type CategorySummaryDTO struct {
	MostUsed     string
	Distribution []CategoryDistributionDTO
}

type CategoryDistributionDTO struct {
	Name       string
	Percentage decimal.Decimal
}
