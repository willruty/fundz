package model

import (
	"time"

	"github.com/google/uuid"
)

type Subscription struct {
	ID uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`

	UserID     uuid.UUID  `gorm:"type:uuid;not null"`
	AccountID  *uuid.UUID `gorm:"type:uuid"`
	CategoryID *uuid.UUID `gorm:"type:uuid"`

	Name            string  `gorm:"not null"`
	Amount          float64 `gorm:"not null"`
	BillingCycle    string  `gorm:"not null"` // monthly | yearly
	NextBillingDate *time.Time
	Active          bool `gorm:"default:true"`

	CreatedAt time.Time
}
