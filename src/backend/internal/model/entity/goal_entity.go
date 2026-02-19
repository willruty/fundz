package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Goal struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;not null"`

	Name          string          `gorm:"not null"`
	TargetAmount  decimal.Decimal `gorm:"not null"`
	CurrentAmount decimal.Decimal `gorm:"default:0"`
	DueDate       *time.Time

	CreatedAt time.Time
}
