package dao

import (
	"fmt"
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/google/uuid"
)

func CreateGoal(goal entity.Goals, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("user_id inválido: %w", err)
	}
	goal.UserID = uid

	if err := database.DB.Create(&goal).Error; err != nil {
		return err
	}
	return nil
}

func FindAllGoals(userID string) ([]entity.Goals, int64, error) {
	var goals []entity.Goals
	var count int64

	database.DB.Model(&entity.Goals{}).Where("user_id = ?", userID).Count(&count)

	result := database.DB.Where("user_id = ?", userID).Find(&goals)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return goals, count, nil
}

func FindGoalByID(id, userID string) (entity.Goals, error) {
	var goal entity.Goals

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&goal).Error; err != nil {
		return goal, fmt.Errorf("meta não encontrada")
	}

	return goal, nil
}

func UpdateGoalByID(input entity.Goals, userID string) error {
	query := database.DB.Model(&entity.Goals{}).
		Where("id = ? AND user_id = ?", input.ID, userID).
		Updates(input)

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("meta não encontrada")
	}

	return nil
}

func DeleteGoalByID(id, userID string) error {
	query := database.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&entity.Goals{})

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("meta não encontrada")
	}

	return nil
}
