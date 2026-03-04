package service

import (
	"fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/shopspring/decimal"
)

func FilterNextGoal(userId string) (entity.Goals, decimal.Decimal, error) {
	var goal entity.Goals

	err := database.DB.Model(&entity.Goals{}).
		Where("user_id = ? AND current_amount < target_amount", userId).
		Order("due_date ASC").
		First(&goal).Error

	if err != nil {
		return entity.Goals{}, decimal.Zero, err
	}

	if goal.TargetAmount.IsZero() {
		return goal, decimal.Zero, nil
	}

	percentage := goal.CurrentAmount.Div(goal.TargetAmount).Mul(decimal.NewFromInt(100))

	return goal, percentage, nil
}

func GetGoalsSummary() {}
