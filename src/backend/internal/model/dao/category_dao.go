package dao

import (
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/google/uuid"
)

// -------
// Create
// -------
func CreateCategory(category entity.Categories) error {
	if err := database.DB.Create(&category).Error; err != nil {
		return err
	}
	return nil
}

// -------
// ReadAll
// -------
func GetAllCategories() ([]entity.Categories, int64, error) {

	var categories []entity.Categories
	var count int64

	result := database.DB.Model(&entity.Categories{}).Count(&count).Find(&categories)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return categories, result.RowsAffected, nil
}

// -------
// Read
// -------
func GetCategoryById(id string) (entity.Categories, error) {

	var category entity.Categories
	if err := database.DB.Where("id = ?", id).First(&category).Error; err != nil {
		return category, err
	}

	return category, nil
}

// -------
// Update
// -------
func UpdateCategoryById(input entity.Categories, id uuid.UUID) error {

	var category entity.Categories
	if err := database.DB.Model(&category).Where("id = ?", id).Updates(input).Error; err != nil {
		return err
	}

	return nil
}

// -------
// Delete
// -------
func DeleteCategoryById(id string) error {

	var category entity.Categories
	if err := database.DB.Model(&category).Where("id = ?", id).Delete(category).Error; err != nil {
		return err
	}

	return nil
}
