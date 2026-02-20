package dao

import (
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"
)

// -------
// Create
// -------
func CreateGoal(goal entity.Goals) error {
	if err := database.DB.Create(&goal).Error; err != nil {
		return err
	}
	return nil
}

// -------
// ReadAll
// -------
func FindAllGoals() ([]entity.Goals, int64, error) {

	var goals []entity.Goals
	var count int64

	result := database.DB.Model(&entity.Categories{}).Count(&count).Find(&goals)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return goals, result.RowsAffected, nil
}

// -------
// Read
// -------
func FindGoalById(id string) (entity.Goals, error) {
	var goal entity.Goals
	if err := database.DB.Where("id = ?", id).First(&goal).Error; err != nil {
		return goal, err
	}

	return goal, nil
}

// -------
// Update
// -------
func UpdateGoalById(input entity.Goals) error {
	var goal entity.Goals
	if err := database.DB.Model(&goal).Where("id = ?", input.ID).Updates(input).Error; err != nil {
		return err
	}

	return nil
}

// -------
// Delete
// -------
func DeleteGoalById(id string) error {
	var goal entity.Goals
	if err := database.DB.Model(&goal).Where("id = ?", id).Delete(goal).Error; err != nil {
		return err
	}

	return nil
}
