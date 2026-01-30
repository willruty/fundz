package dao

import (
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"
)

// -------
// Create
// -------
func CreateGoal(goal entity.Goal) error {
	if err := database.DB.Create(&goal).Error; err != nil {
		return err
	}
	return nil
}

// -------
// ReadAll
// -------
func FindAllGoals() ([]entity.Goal, int64, error) {

	var goals []entity.Goal
	var count int64

	result := database.DB.Model(&entity.Category{}).Count(&count).Find(&goals)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return goals, result.RowsAffected, nil
}

// -------
// Read
// -------
func FindGoalById(id string) (entity.Goal, error) {
	var goal entity.Goal
	if err := database.DB.Where("goal_id = ?", id).First(&goal).Error; err != nil {
		return goal, err
	}

	return goal, nil
}

// -------
// Update
// -------
func UpdateGoalById(input entity.Goal, id string) error {
	var goal entity.Goal
	if err := database.DB.Model(&goal).Where("goal_id = ?", id).Updates(input).Error; err != nil {
		return err
	}

	return nil
}

// -------
// Delete
// -------
func DeleteGoalById(id string) error {
	var goal entity.Goal
	if err := database.DB.Model(&goal).Where("goal_id = ?", id).Delete(goal).Error; err != nil {
		return err
	}

	return nil
}
