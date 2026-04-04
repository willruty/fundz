package dao

import (
	"fmt"
	database "fundz/internal/database"
	entity "fundz/internal/model/entity"

	"github.com/google/uuid"
)

func CreateSubscription(subscription entity.Subscriptions, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("user_id inválido: %w", err)
	}
	subscription.UserID = uid

	if err := database.DB.Create(&subscription).Error; err != nil {
		return err
	}
	return nil
}

func FindAllSubscriptions(userID string) ([]entity.Subscriptions, int64, error) {
	var subscriptions []entity.Subscriptions
	var count int64

	database.DB.Model(&entity.Subscriptions{}).Where("user_id = ?", userID).Count(&count)

	result := database.DB.Where("user_id = ?", userID).Find(&subscriptions)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return subscriptions, count, nil
}

func FindSubscriptionByID(id, userID string) (entity.Subscriptions, error) {
	var subscription entity.Subscriptions

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&subscription).Error; err != nil {
		return subscription, fmt.Errorf("assinatura não encontrada")
	}

	return subscription, nil
}

func UpdateSubscriptionByID(input entity.Subscriptions, userID string) error {
	query := database.DB.Model(&entity.Subscriptions{}).
		Where("id = ? AND user_id = ?", input.ID, userID).
		Updates(input)

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("assinatura não encontrada")
	}

	return nil
}

func DeleteSubscriptionByID(id, userID string) error {
	query := database.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&entity.Subscriptions{})

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("assinatura não encontrada")
	}

	return nil
}

