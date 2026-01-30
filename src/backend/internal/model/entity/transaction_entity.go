package model

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`

	UserID     uuid.UUID  `gorm:"type:uuid;not null"`
	AccountID  uuid.UUID  `gorm:"type:uuid;not null"`
	CategoryID *uuid.UUID `gorm:"type:uuid"`

	Amount      float64   `gorm:"not null"`
	Type        string    `gorm:"not null"` // income | expense | transfer
	Description string
	OccurredAt  time.Time `gorm:"not null"`

	CreatedAt time.Time
}
