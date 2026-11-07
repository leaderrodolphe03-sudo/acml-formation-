import type { Role } from './types'

export const homeOf = (role: Role) => (role === 'etudiant' ? '/etudiant' : '/superviseur')
