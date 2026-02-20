package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Goals struct {
	ID     uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`

	Name          string          `json:"name" gorm:"not null"`
	TargetAmount  decimal.Decimal `json:"target_amount" gorm:"not null"`
	CurrentAmount decimal.Decimal `json:"current_amount" gorm:"default:0"`
	DueDate       *time.Time      `json:"due_date"`

	CreatedAt time.Time `json:"created_at"`
}
