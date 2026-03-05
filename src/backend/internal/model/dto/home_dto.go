package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type DashboardDTO struct {
	Accounts              []AccountSummaryDTO     `json:"accounts"`
	LastMonthTransactions []TransactionSummaryDTO `json:"last_month_transactions"`
	Goal                  GoalSummaryDTO          `json:"goal"`
	Categories            CategorySummaryDTO      `json:"categories"`
}

type AccountSummaryDTO struct {
	Name    string          `json:"name"`
	Balance decimal.Decimal `json:"balance"`
}

type GoalSummaryDTO struct {
	Name       string          `json:"name"`
	Target     decimal.Decimal `json:"target"`
	Current    decimal.Decimal `json:"current"`
	Date       time.Time       `json:"date"`
	Percentage decimal.Decimal `json:"percentage"`
}

type TransactionSummaryDTO struct {
	Date  time.Time       `json:"date"`
	Value decimal.Decimal `json:"value"`
	Type  string          `json:"type"`
}

type CategorySummaryDTO struct {
	MostUsed     CategoryMostUsed          `json:"most_used"`
	Distribution []CategoryDistributionDTO `json:"distribution"`
}

type CategoryMostUsed struct {
	Name   string          `json:"name"`
	Amount decimal.Decimal `json:"amount"`
}

type CategoryDistributionDTO struct {
	Name       string          `json:"name"`
	Amount     decimal.Decimal `json:"amount"`
	Percentage decimal.Decimal `json:"percentage"`
}
