--!strict
local Utilities = {}

function Utilities.keys<K, V>(dictionary: {[K]: V}): {K}
	local result = {}
	local length = 0

	for key in dictionary do
		length += 1
		result[length] = key
	end

	return result
end

return table.freeze(Utilities)
