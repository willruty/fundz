package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"

	"github.com/google/uuid"
)

func CreateTransaction(transaction model.Transactions, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("user_id inválido: %w", err)
	}
	transaction.UserID = uid

	if err := database.DB.Create(&transaction).Error; err != nil {
		return err
	}
	return nil
}

func GetAllTransactions(userID string) ([]model.Transactions, int64, error) {
	var transactions []model.Transactions
	var count int64

	database.DB.Model(&model.Transactions{}).Where("user_id = ?", userID).Count(&count)

	result := database.DB.Where("user_id = ?", userID).Order("occurred_at DESC").Find(&transactions)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return transactions, count, nil
}

func GetTransactionByID(id, userID string) (model.Transactions, error) {
	var transaction model.Transactions

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error; err != nil {
		return transaction, fmt.Errorf("transação não encontrada")
	}

	return transaction, nil
}

func UpdateTransactionByID(input model.Transactions, id uuid.UUID, userID string) error {
	query := database.DB.Model(&model.Transactions{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(input)

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("transação não encontrada")
	}

	return nil
}

func DeleteTransactionByID(id, userID string) error {
	query := database.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&model.Transactions{})

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("transação não encontrada")
	}

	return nil
}
