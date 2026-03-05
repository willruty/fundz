package service

import (
	"errors"
	"fundz/internal/database"
	"fundz/internal/model/dto"
	entity "fundz/internal/model/entity"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/shopspring/decimal"
)

type GoalService struct{}

func (g GoalService) FilterNextGoal(userId string) (dto.GoalSummaryDTO, error) {

	var goal entity.Goals

	err := database.DB.Model(&entity.Goals{}).
		Where("user_id = ? AND current_amount < target_amount", userId).
		Order("due_date ASC").
		First(&goal).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return dto.GoalSummaryDTO{}, nil
		}
		return dto.GoalSummaryDTO{}, err
	}

	if goal.TargetAmount.IsZero() {
		return dto.GoalSummaryDTO{}, nil
	}

	percentage := goal.CurrentAmount.Div(goal.TargetAmount).Mul(decimal.NewFromInt(100)).Round(2)

	var dueDate time.Time
	if goal.DueDate != nil {
		dueDate = *goal.DueDate
	}

	return dto.GoalSummaryDTO{
		Name:       goal.Name,
		Target:     goal.TargetAmount,
		Current:    goal.CurrentAmount,
		Date:       dueDate,
		Percentage: percentage,
	}, nil
}
