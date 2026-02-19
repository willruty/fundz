package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Transactions struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`

	UserID     uuid.UUID  `json:"user_id" gorm:"type:uuid;not null"`
	AccountID  uuid.UUID  `json:"account_id" gorm:"type:uuid;not null"`
	CategoryID *uuid.UUID `json:"category_id" gorm:"type:uuid"`

	Amount      decimal.Decimal `json:"amount" gorm:"not null"`
	Type        string          `json:"type" gorm:"not null"`
	Description string          `json:"description"`
	OccurredAt  time.Time       `json:"occured_at" gorm:"not null"`

	CreatedAt time.Time `json:"created_at"`
}
