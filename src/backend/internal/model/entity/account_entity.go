package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Accounts struct {
	ID     uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`

	Name    string          `json:"name" gorm:"not null"`
	Type    string          `json:"type" gorm:"not null"`
	Balance decimal.Decimal `json:"balance" gorm:"default:0"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
