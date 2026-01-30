package model

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;not null"`

	Name    string  `gorm:"not null"`
	Type    string  `gorm:"not null"`
	Balance float64 `gorm:"default:0"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
