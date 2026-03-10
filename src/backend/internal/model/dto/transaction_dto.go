package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type TransactionTableDTO struct {
	ID       string          `json:"id"`
	Date     time.Time       `json:"date"`
	Value    decimal.Decimal `json:"value"`
	Type     string          `json:"type"`
	Category string          `json:"category"`
	Account  string          `json:"account"`
}

type TransactionListResponse struct {
	Data []TransactionTableDTO `json:"data"`
	Meta PaginationMeta        `json:"meta"`
}

type PaginationMeta struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
	Total int `json:"total"`
	Pages int `json:"pages"`
}
