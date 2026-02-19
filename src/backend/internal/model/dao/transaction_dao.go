package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"

	"github.com/google/uuid"
)

// -------
// Create
// -------
func CreateTransaction(transaction model.Transactions) error {
	if err := database.DB.Model(&model.Transactions{}).Create(&transaction).Error; err != nil {
		return err
	}
	return nil
}

func GetAllTransaction() ([]model.Transactions, int64, error) {

	var transaction []model.Transactions
	var count int64

	result := database.DB.Model(&model.Transactions{}).Count(&count).Find(&transaction)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return transaction, result.RowsAffected, nil
}

func GetTransactionById(pk string) (model.Transactions, error) {
	var transaction model.Transactions

	if err := database.DB.Where("id = ?", pk).First(&transaction).Error; err != nil {
		return transaction, err
	}

	return transaction, nil
}

// -------
// Update
// -------
func UpdateTransactionById(modelUpdated model.Transactions, id uuid.UUID) error {

	query := database.DB.Model(&model.Transactions{}).Where("id = ?", id).Updates(modelUpdated)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}

// -------
// Delete
// -------
func DeleteTransactionById(id string) error {
	var transaction model.Transactions

	query := database.DB.Where("id = ?", id).Delete(transaction)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}
