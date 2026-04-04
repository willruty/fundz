package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

func CreateAccount(account model.Accounts, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("user_id inválido: %w", err)
	}
	account.UserID = uid

	if err := database.DB.Create(&account).Error; err != nil {
		return err
	}
	return nil
}

func GetAllAccounts(userID string) ([]model.Accounts, int64, error) {
	var accounts []model.Accounts
	var count int64

	database.DB.Model(&model.Accounts{}).Where("user_id = ?", userID).Count(&count)

	result := database.DB.Where("user_id = ?", userID).Find(&accounts)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return accounts, count, nil
}

func GetAccountByID(id, userID string) (model.Accounts, error) {
	var account model.Accounts

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&account).Error; err != nil {
		return account, fmt.Errorf("conta não encontrada")
	}

	return account, nil
}

func GetCurrentBalanceByID(userID, accountID string) (decimal.Decimal, error) {
	var balance decimal.Decimal

	if err := database.DB.Model(&model.Accounts{}).
		Where("id = ? AND user_id = ?", accountID, userID).
		Select("balance").Row().Scan(&balance); err != nil {
		return decimal.Zero, err
	}

	return balance, nil
}

func UpdateAccountByID(input model.Accounts, userID string) error {
	query := database.DB.Model(&model.Accounts{}).
		Where("id = ? AND user_id = ?", input.ID, userID).
		Updates(input)

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("conta não encontrada")
	}

	return nil
}

func DeleteAccountByID(id, userID string) error {
	query := database.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&model.Accounts{})

	if err := query.Error; err != nil {
		return err
	}
	if query.RowsAffected == 0 {
		return fmt.Errorf("conta não encontrada")
	}

	return nil
}
