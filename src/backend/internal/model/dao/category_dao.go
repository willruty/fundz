package dao

import (
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/google/uuid"
)

// -------
// Create
// -------
func CreateCategory(category entity.Category) error {
	if err := database.DB.Create(&category).Error; err != nil {
		return err
	}
	return nil
}

// -------
// ReadAll
// -------
func GetAllCategories() ([]entity.Category, int64, error) {

	var categories []entity.Category
	var count int64

	result := database.DB.Model(&entity.Category{}).Count(&count).Find(&categories)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return categories, result.RowsAffected, nil
}

// -------
// Read
// -------
func GetCategoryById(id string) (entity.Category, error) {

	var category entity.Category
	if err := database.DB.Where("category_id = ?", id).First(&category).Error; err != nil {
		return category, err
	}

	return category, nil
}

// -------
// Update
// -------
func UpdateCategoryById(input entity.Category, id uuid.UUID) error {

	var category entity.Category
	if err := database.DB.Model(&category).Where("category_id = ?", id).Updates(input).Error; err != nil {
		return err
	}

	return nil
}

// -------
// Delete
// -------
func DeleteCategoryById(id string) error {

	var category entity.Category
	if err := database.DB.Model(&category).Where("category_id = ?", id).Delete(category).Error; err != nil {
		return err
	}

	return nil
}
