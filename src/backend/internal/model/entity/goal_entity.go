package model

import (
	"time"

	"github.com/google/uuid"
)

type Goal struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;not null"`

	Name          string  `gorm:"not null"`
	TargetAmount  float64 `gorm:"not null"`
	CurrentAmount float64 `gorm:"default:0"`
	DueDate       *time.Time

	CreatedAt time.Time
}
