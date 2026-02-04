package model

import (
	"time"

	"github.com/google/uuid"
)

type Users struct {
	ID           uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Email        string    `gorm:"uniqueIndex;not null"`
	PasswordHash string    `gorm:"not null"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
