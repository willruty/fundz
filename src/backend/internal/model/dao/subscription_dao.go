package dao

import (
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"
)

// -------
// Create
// -------
func CreateSubscription(subscription entity.Subscriptions) error {
	if err := database.DB.Create(&subscription).Error; err != nil {
		return err
	}
	return nil
}

// -------
// ReadAll
// -------
func FindAllSubscriptions() ([]entity.Subscriptions, int64, error) {

	var subscriptions []entity.Subscriptions
	var count int64

	result := database.DB.Model(&entity.Subscriptions{}).Count(&count).Find(&subscriptions)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return subscriptions, result.RowsAffected, nil
}

// -------
// Read
// -------
func FindSubscriptionById(id string) (entity.Subscriptions, error) {
	var subscription entity.Subscriptions
	if err := database.DB.Where("id = ?", id).First(&subscription).Error; err != nil {
		return subscription, err
	}

	return subscription, nil
}

// -------
// Update
// -------
func UpdateSubscriptionById(input entity.Subscriptions) error {
	var subscription entity.Subscriptions
	if err := database.DB.Model(&subscription).Where("id = ?", input.ID).Updates(input).Error; err != nil {
		return err
	}

	return nil
}

// -------
// Delete
// -------
func DeleteSubscriptionById(id string) error {
	var subscription entity.Subscriptions
	if err := database.DB.Model(&subscription).Where("id = ?", id).Delete(&subscription).Error; err != nil {
		return err
	}

	return nil
}
