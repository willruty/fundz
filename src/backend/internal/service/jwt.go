package service

import (
	"fmt"
	"fundz/internal/config"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// JWTClaims suporta tanto o formato legado (user_id) quanto o padrão Supabase (sub).
type JWTClaims struct {
	Sub    string    `json:"sub"`     // Supabase standard
	UserId uuid.UUID `json:"user_id"` // legado
	jwt.RegisteredClaims
}

// GenerateJWT cria um token no formato legado (fluxo de auth próprio).
func GenerateJWT(id uuid.UUID) (string, error) {
	jwtSecret := config.Env.Jwt.JWTSECRET
	claims := JWTClaims{
		UserId: id,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(2 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// ValidateJWT valida o token e retorna o userID como string.
// Suporta tokens Supabase (claim "sub") e tokens legados (claim "user_id").
func ValidateJWT(tokenString string) (string, error) {
	jwtSecret := config.Env.Jwt.JWTSECRET
	claims := &JWTClaims{}

	parser := jwt.NewParser(jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Name}))

	token, err := parser.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("token inválido")
	}

	// Prioriza o claim "sub" (padrão Supabase)
	if claims.Sub != "" {
		return claims.Sub, nil
	}

	// Fallback para claim "user_id" (legado)
	if claims.UserId != (uuid.UUID{}) {
		return claims.UserId.String(), nil
	}

	return "", fmt.Errorf("token sem identificador de usuário")
}
