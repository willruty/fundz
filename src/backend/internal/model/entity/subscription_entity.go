package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Subscriptions struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`

	UserID     uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	AccountID  *uuid.UUID `json:"account_id" gorm:"type:uuid"`
	CategoryID *uuid.UUID `json:"category_id" gorm:"type:uuid"`

	Name            string          `json:"name" gorm:"not null"`
	Amount          decimal.Decimal `json:"amount" gorm:"not null"`
	BillingCycle    string          `json:"billing_cycle" gorm:"not null"` // monthly | yearly
	NextBillingDate *time.Time      `json:"next_billing_date"`
	Active          bool            `json:"active" gorm:"default:true"`

	CreatedAt time.Time `json:"created_at"`
}
