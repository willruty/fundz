package dao

import (
	"fmt"
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/google/uuid"
)

func CreateCategory(category entity.Categories, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("user_id inválido: %w", err)
	}
	category.UserID = uid

	if err := database.DB.Create(&category).Error; err != nil {
		return err
	}
	return nil
}

func GetAllCategories(userID string) ([]entity.Categories, int64, error) {
	var categories []entity.Categories
	var count int64

	database.DB.Model(&entity.Categories{}).Where("user_id = ?", userID).Count(&count)

	result := database.DB.Where("user_id = ?", userID).Find(&categories)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return categories, count, nil
}

func GetCategoryByID(id, userID string) (entity.Categories, error) {
	var category entity.Categories

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&category).Error; err != nil {
		return category, fmt.Errorf("categoria não encontrada")
	}

	return category, nil
}

func UpdateCategoryByID(input entity.Categories, id uuid.UUID, userID string) error {
	query := database.DB.Model(&entity.Categories{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(input)

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("categoria não encontrada")
	}

	return nil
}

func DeleteCategoryByID(id, userID string) error {
	query := database.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&entity.Categories{})

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("categoria não encontrada")
	}

	return nil
}
