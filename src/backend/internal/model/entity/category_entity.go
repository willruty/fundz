package model

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;not null"`

	Name string `gorm:"not null"`
	Type string `gorm:"not null"` // income | expense

	CreatedAt time.Time
}
